// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./MultiSigManager.sol";

/**
 * @title SafeVault
 * @dev A secure vault contract that protects user assets through multi-signature functionality.
 * Similar to a traditional EIP-4337 contract account with enhanced security features.
 */
contract SafeVault {
    // Storage layout to prevent slot collision
    bytes32 private constant OWNER_SLOT = keccak256("vault.owner");
    bytes32 private constant MULTISIG_SLOT = keccak256("vault.multisig");
    bytes32 private constant INITIALIZED_SLOT = keccak256("vault.initialized");

    // Events
    event VaultInitialized(address indexed owner, address indexed multisig);
    event Deposit(address indexed sender, uint256 amount);
    event TransferExecuted(address indexed to, uint256 amount);
    event ERC20TransferExecuted(address indexed token, address indexed to, uint256 amount);
    event NFTTransferExecuted(address indexed token, address indexed to, uint256 tokenId);
    event BatchTransferExecuted(address[] targets, uint256[] values, bytes[] data);

    /**
     * @dev Initialize the vault with an owner and multi-signature manager
     * @param _owner The address of the vault owner
     * @param _multisig The address of the multi-signature manager contract
     */
    function initialize(address _owner, address _multisig) external {
        require(!_isInitialized(), "Already initialized");
        require(_owner != address(0), "Invalid owner address");
        require(_multisig != address(0), "Invalid multisig address");
        
        _setOwner(_owner);
        _setMultiSig(_multisig);
        _setInitialized(true);
        
        emit VaultInitialized(_owner, _multisig);
    }

    /**
     * @dev Execute a native token transfer
     * @param _to The recipient address
     * @param _amount The amount to transfer
     * @param _userWeight The user's rejection weight for this transaction
     * @param _companyWeight The company's rejection weight for this transaction
     * @param _userSignature The user's signature for the transaction and weights
     * @param _companySignature The company's signature for the transaction and weights
     */
    function executeTransfer(
        address payable _to,
        uint256 _amount,
        uint256 _userWeight,
        uint256 _companyWeight,
        bytes memory _userSignature,
        bytes memory _companySignature
    ) external {
        require(msg.sender == _getOwner(), "Only owner can execute");
        require(_to != address(0), "Invalid recipient");
        require(_amount > 0, "Amount must be greater than 0");
        require(_amount <= address(this).balance, "Insufficient balance");
        
        // Create transaction hash
        bytes32 txHash = keccak256(abi.encodePacked(
            "transfer",
            _to,
            _amount,
            block.chainid,
            address(this)
        ));
        
        // Check if transaction should be rejected
        bool rejected = MultiSigManager(_getMultiSig()).checkRejection(
            txHash,
            _userWeight,
            _companyWeight,
            _userSignature,
            _companySignature
        );
        require(!rejected, "Transaction rejected by multi-signature");
        
        // Execute transfer
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Transfer failed");
        
        emit TransferExecuted(_to, _amount);
    }

    /**
     * @dev Execute an ERC20 token transfer
     * @param _token The ERC20 token address
     * @param _to The recipient address
     * @param _amount The amount to transfer
     * @param _userWeight The user's rejection weight for this transaction
     * @param _companyWeight The company's rejection weight for this transaction
     * @param _userSignature The user's signature for the transaction and weights
     * @param _companySignature The company's signature for the transaction and weights
     */
    function executeERC20Transfer(
        address _token,
        address _to,
        uint256 _amount,
        uint256 _userWeight,
        uint256 _companyWeight,
        bytes memory _userSignature,
        bytes memory _companySignature
    ) external {
        require(msg.sender == _getOwner(), "Only owner can execute");
        require(_token != address(0), "Invalid token address");
        require(_to != address(0), "Invalid recipient");
        require(_amount > 0, "Amount must be greater than 0");
        
        // Create transaction hash
        bytes32 txHash = keccak256(abi.encodePacked(
            "erc20transfer",
            _token,
            _to,
            _amount,
            block.chainid,
            address(this)
        ));
        
        // Check if transaction should be rejected
        bool rejected = MultiSigManager(_getMultiSig()).checkRejection(
            txHash,
            _userWeight,
            _companyWeight,
            _userSignature,
            _companySignature
        );
        require(!rejected, "Transaction rejected by multi-signature");
        
        // Execute ERC20 transfer
        (bool success, bytes memory data) = _token.call(
            abi.encodeWithSignature("transfer(address,uint256)", _to, _amount)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "ERC20 transfer failed");
        
        emit ERC20TransferExecuted(_token, _to, _amount);
    }

    /**
     * @dev Execute an NFT (ERC721) token transfer
     * @param _token The ERC721 token address
     * @param _to The recipient address
     * @param _tokenId The token ID to transfer
     * @param _userWeight The user's rejection weight for this transaction
     * @param _companyWeight The company's rejection weight for this transaction
     * @param _userSignature The user's signature for the transaction and weights
     * @param _companySignature The company's signature for the transaction and weights
     */
    function executeNFTTransfer(
        address _token,
        address _to,
        uint256 _tokenId,
        uint256 _userWeight,
        uint256 _companyWeight,
        bytes memory _userSignature,
        bytes memory _companySignature
    ) external {
        require(msg.sender == _getOwner(), "Only owner can execute");
        require(_token != address(0), "Invalid token address");
        require(_to != address(0), "Invalid recipient");
        
        // Create transaction hash
        bytes32 txHash = keccak256(abi.encodePacked(
            "nfttransfer",
            _token,
            _to,
            _tokenId,
            block.chainid,
            address(this)
        ));
        
        // Check if transaction should be rejected
        bool rejected = MultiSigManager(_getMultiSig()).checkRejection(
            txHash,
            _userWeight,
            _companyWeight,
            _userSignature,
            _companySignature
        );
        require(!rejected, "Transaction rejected by multi-signature");
        
        // Execute NFT transfer
        (bool success, ) = _token.call(
            abi.encodeWithSignature("safeTransferFrom(address,address,uint256)", address(this), _to, _tokenId)
        );
        require(success, "NFT transfer failed");
        
        emit NFTTransferExecuted(_token, _to, _tokenId);
    }

    /**
     * @dev Execute multiple transactions in a batch
     * @param _targets The target addresses
     * @param _values The values to send
     * @param _data The call data
     * @param _userWeight The user's rejection weight for this transaction
     * @param _companyWeight The company's rejection weight for this transaction
     * @param _userSignature The user's signature for the transaction and weights
     * @param _companySignature The company's signature for the transaction and weights
     */
    function executeBatch(
        address[] calldata _targets,
        uint256[] calldata _values,
        bytes[] calldata _data,
        uint256 _userWeight,
        uint256 _companyWeight,
        bytes memory _userSignature,
        bytes memory _companySignature
    ) external {
        require(msg.sender == _getOwner(), "Only owner can execute");
        require(_targets.length > 0, "Empty targets");
        require(_targets.length == _values.length, "Length mismatch: targets and values");
        require(_targets.length == _data.length, "Length mismatch: targets and data");
        
        // Create transaction hash
        bytes32 txHash = keccak256(abi.encodePacked(
            "batch",
            keccak256(abi.encode(_targets)),
            keccak256(abi.encode(_values)),
            keccak256(abi.encode(_data)),
            block.chainid,
            address(this)
        ));
        
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
        for (uint256 i = 0; i < _targets.length; i++) {
            require(_targets[i] != address(0), "Invalid target address");
            
            (bool success, ) = _targets[i].call{value: _values[i]}(_data[i]);
            require(success, "Transaction execution failed");
        }
        
        emit BatchTransferExecuted(_targets, _values, _data);
    }

    /**
     * @dev Get the owner of the vault
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

    // Receive function to accept ETH
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}