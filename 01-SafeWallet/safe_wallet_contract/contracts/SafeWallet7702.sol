// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./MultiSigManager.sol";
import "./SafeVault.sol";
import "./IEIP7702.sol";

/**
 * @title SafeWallet7702
 * @dev Implementation of EIP-7702 Contract Account with security features.
 * Supports batch transaction execution, multi-signature rejection mechanism,
 * and proxy functionality.
 */
contract SafeWallet7702 is IEIP7702 {
    // Storage layout to prevent slot collision
    bytes32 private constant OWNER_SLOT = keccak256("wallet.owner");
    bytes32 private constant MULTISIG_SLOT = keccak256("wallet.multisig");
    bytes32 private constant VAULT_SLOT = keccak256("wallet.vault");
    bytes32 private constant INITIALIZED_SLOT = keccak256("wallet.initialized");
    bytes32 private constant IMPLEMENTATION_SLOT = keccak256("wallet.implementation");
    bytes32 private constant NONCE_SLOT = keccak256("wallet.nonce");

    // Events
    event WalletInitialized(address indexed owner, address indexed multisig, address indexed vault);
    event TransactionExecuted(address indexed target, uint256 value, bytes data);
    event BatchExecuted(address[] targets, uint256[] values, bytes[] data);
    event VaultCreated(address indexed vault);
    event ImplementationChanged(address indexed implementation);
    event Received(address indexed sender, uint256 value);

    /**
     * @dev Initialize the wallet with an owner, multi-signature manager, and vault
     * @param _owner The address of the wallet owner
     * @param _companyAddress The address of the company (security provider)
     * @param _riskLevel The initial risk level
     */
    function initialize(
        address _owner,
        address _companyAddress,
        uint256 _riskLevel
    ) external {
        require(!_isInitialized(), "Already initialized");
        require(_owner != address(0), "Invalid owner address");
        require(_companyAddress != address(0), "Invalid company address");
        
        // Set owner
        _setOwner(_owner);
        
        // Deploy MultiSigManager
        MultiSigManager multisig = new MultiSigManager();
        multisig.initialize(_owner, _companyAddress, _riskLevel);
        _setMultiSig(address(multisig));
        
        // Deploy SafeVault
        SafeVault vault = new SafeVault();
        vault.initialize(_owner, address(multisig));
        _setVault(address(vault));
        
        // Set initialized
        _setInitialized(true);
        
        emit WalletInitialized(_owner, address(multisig), address(vault));
        emit VaultCreated(address(vault));
    }

    /**
     * @dev Execute a single transaction with multi-signature rejection check
     * @param _target The target address
     * @param _value The value to send
     * @param _data The call data
     * @param _userWeight The user's rejection weight for this transaction
     * @param _companyWeight The company's rejection weight for this transaction
     * @param _userSignature The user's signature for the transaction
     * @param _companySignature The company's signature for the transaction
     * @return success Whether the transaction was successful
     * @return result The result of the transaction
     */
    function execute(
        address _target,
        uint256 _value,
        bytes calldata _data,
        uint256 _userWeight,
        uint256 _companyWeight,
        bytes memory _userSignature,
        bytes memory _companySignature
    ) external override returns (bool success, bytes memory result) {
        require(msg.sender == _getOwner(), "Only owner can execute");
        require(_target != address(0), "Invalid target address");
        
        // Create transaction hash
        bytes32 txHash = keccak256(abi.encodePacked(
            "execute",
            _target,
            _value,
            keccak256(_data),
            _getNonce(),
            block.chainid,
            address(this)
        ));
        
        // Increment nonce
        _incrementNonce();
        
        // Check if transaction should be rejected
        bool rejected = MultiSigManager(_getMultiSig()).checkRejection(
            txHash,
            _userWeight,
            _companyWeight,
            _userSignature,
            _companySignature
        );
        require(!rejected, "Transaction rejected by multi-signature");
        
        // Execute transaction
        (success, result) = _target.call(_data);
        require(success, "Transaction execution failed");
        
        emit TransactionExecuted(_target, _value, _data);
        
        return (success, result);
    }

    /**
     * @dev Execute multiple transactions in a batch with multi-signature rejection check
     * @param _targets The target addresses
     * @param _values The values to send
     * @param _data The call data for each transaction
     * @param _userWeight The user's rejection weight for this transaction
     * @param _companyWeight The company's rejection weight for this transaction
     * @param _userSignature The user's signature for the transaction
     * @param _companySignature The company's signature for the transaction
     * @return results The results of each transaction
     */
    function executeBatch(
        address[] calldata _targets,
        uint256[] calldata _values,
        bytes[] calldata _data,
        uint256 _userWeight,
        uint256 _companyWeight,
        bytes memory _userSignature,
        bytes memory _companySignature
    ) external override returns (bytes[] memory results) {
        // require(msg.sender == _getOwner(), "Only owner can execute");
        require(_targets.length > 0, "Empty targets");
        require(_targets.length == _values.length, "Length mismatch: targets and values");
        require(_targets.length == _data.length, "Length mismatch: targets and data");
        
        // Create transaction hash
        bytes32 txHash = keccak256(abi.encodePacked(
            "executeBatch",
            keccak256(abi.encode(_targets)),
            keccak256(abi.encode(_values)),
            keccak256(abi.encode(_data)),
            _getNonce(),
            block.chainid,
            address(this)
        ));
        
        // Increment nonce
        _incrementNonce();
        
        // Check if transaction should be rejected
        bool rejected = MultiSigManager(_getMultiSig()).checkRejection(
            txHash,
            _userWeight,
            _companyWeight,
            _userSignature,
            _companySignature
        );
        require(!rejected, "Transaction rejected by multi-signature");
        
        // Execute batch transactions
        results = new bytes[](_targets.length);
        
        for (uint256 i = 0; i < _targets.length; i++) {
            require(_targets[i] != address(0), "Invalid target address");
            
            
            (bool success, bytes memory result) = _targets[i].call(_data[i]);
            require(success, "Transaction execution failed");
            
            results[i] = result;
        }
        
        emit BatchExecuted(_targets, _values, _data);
        
        return results;
    }

    /**
     * @dev Set a new implementation address for proxy functionality
     * @param _implementation The new implementation address
     * @param _userWeight The user's rejection weight for this transaction
     * @param _companyWeight The company's rejection weight for this transaction
     * @param _userSignature The user's signature for the transaction
     * @param _companySignature The company's signature for the transaction
     */
    function setImplementation(
        address _implementation,
        uint256 _userWeight,
        uint256 _companyWeight,
        bytes memory _userSignature,
        bytes memory _companySignature
    ) external {
        require(msg.sender == _getOwner(), "Only owner can set implementation");
        require(_implementation != address(0), "Invalid implementation address");
        
        // Check if the current implementation is our template
        address currentImpl = _getImplementation();
        if (currentImpl != address(0)) {
            // If we already have an implementation and it's our template,
            // we don't allow changing it directly
            bytes4 templateMagic = bytes4(keccak256("safeWalletTemplate()"));
            (bool success, bytes memory result) = currentImpl.staticcall(abi.encodeWithSelector(templateMagic));
            
            if (success && abi.decode(result, (bool))) {
                revert("Cannot replace our template implementation");
            }
        }
        
        // Create transaction hash
        bytes32 txHash = keccak256(abi.encodePacked(
            "setImplementation",
            _implementation,
            _getNonce(),
            block.chainid,
            address(this)
        ));
        
        // Increment nonce
        _incrementNonce();
        
        // Check if transaction should be rejected
        bool rejected = MultiSigManager(_getMultiSig()).checkRejection(
            txHash,
            _userWeight,
            _companyWeight,
            _userSignature,
            _companySignature
        );
        require(!rejected, "Transaction rejected by multi-signature");
        
        // Set implementation
        _setImplementation(_implementation);
        
        emit ImplementationChanged(_implementation);
    }

    /**
     * @dev Get the owner of the wallet
     * @return The owner address
     */
    function getOwner() external view returns (address) {
        return _getOwner();
    }

    /**
     * @dev Get the multi-signature manager address
     * @return The multi-signature manager address
     */
    function getMultiSig() external view returns (address) {
        return _getMultiSig();
    }

    /**
     * @dev Get the vault address
     * @return The vault address
     */
    function getVault() external view returns (address) {
        return _getVault();
    }

    /**
     * @dev Get the current implementation address
     * @return The implementation address
     */
    function getImplementation() external view returns (address) {
        return _getImplementation();
    }

    /**
     * @dev Get the current nonce
     * @return The current nonce
     */
    function getNonce() external view override returns (uint256) {
        return _getNonce();
    }

    /**
     * @dev Check if this contract is a template
     * @return Always returns true for our template
     */
    function safeWalletTemplate() external pure returns (bool) {
        return true;
    }

    // Internal functions for storage management

    function _setOwner(address _owner) internal {
        bytes32 slot = OWNER_SLOT;
        assembly {
            sstore(slot, _owner)
        }
    }

    function _getOwner() internal view returns (address owner) {
        bytes32 slot = OWNER_SLOT;
        assembly {
            owner := sload(slot)
        }
    }

    function _setMultiSig(address _multisig) internal {
        bytes32 slot = MULTISIG_SLOT;
        assembly {
            sstore(slot, _multisig)
        }
    }

    function _getMultiSig() internal view returns (address multisig) {
        bytes32 slot = MULTISIG_SLOT;
        assembly {
            multisig := sload(slot)
        }
    }

    function _setVault(address _vault) internal {
        bytes32 slot = VAULT_SLOT;
        assembly {
            sstore(slot, _vault)
        }
    }

    function _getVault() internal view returns (address vault) {
        bytes32 slot = VAULT_SLOT;
        assembly {
            vault := sload(slot)
        }
    }

    function _setInitialized(bool _initialized) internal {
        bytes32 slot = INITIALIZED_SLOT;
        assembly {
            sstore(slot, _initialized)
        }
    }

    function _isInitialized() internal view returns (bool initialized) {
        bytes32 slot = INITIALIZED_SLOT;
        assembly {
            initialized := sload(slot)
        }
    }

    function _setImplementation(address _implementation) internal {
        bytes32 slot = IMPLEMENTATION_SLOT;
        assembly {
            sstore(slot, _implementation)
        }
    }

    function _getImplementation() internal view returns (address implementation) {
        bytes32 slot = IMPLEMENTATION_SLOT;
        assembly {
            implementation := sload(slot)
        }
    }

    function _incrementNonce() internal {
        uint256 nonce = _getNonce();
        bytes32 slot = NONCE_SLOT;
        assembly {
            sstore(slot, add(nonce, 1))
        }
    }

    function _getNonce() internal view returns (uint256 nonce) {
        bytes32 slot = NONCE_SLOT;
        assembly {
            nonce := sload(slot)
        }
    }

    // Fallback function to delegate calls to the implementation
    fallback() external payable {
        address implementation = _getImplementation();
        
        // If no implementation is set or the caller is the owner, execute normally
        if (implementation == address(0) || msg.sender == _getOwner()) {
            return;
        }
        
        // Check if the implementation is our template
        bytes4 templateMagic = bytes4(keccak256("safeWalletTemplate()"));
        (bool success, bytes memory result) = implementation.staticcall(abi.encodeWithSelector(templateMagic));
        
        // If it's our template, delegate the call
        if (success && abi.decode(result, (bool))) {
            assembly {
                let ptr := mload(0x40)
                calldatacopy(ptr, 0, calldatasize())
                let delegateResult := delegatecall(gas(), implementation, ptr, calldatasize(), 0, 0)
                let size := returndatasize()
                returndatacopy(ptr, 0, size)
                
                switch delegateResult
                case 0 { revert(ptr, size) }
                default { return(ptr, size) }
            }
        }
    }

    // Receive function to accept ETH
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}