// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @title MultiSigManager
 * @dev Manages multi-signature functionality with a rejection-based approach.
 * If the rejection threshold is met, the transaction will not be executed.
 */
contract MultiSigManager {
    // Storage layout to prevent slot collision
    bytes32 private constant OWNER_SLOT = keccak256("multisig.owner");
    bytes32 private constant THRESHOLD_SLOT = keccak256("multisig.threshold");
    bytes32 private constant WEIGHTS_SLOT = keccak256("multisig.weights");
    bytes32 private constant RISK_LEVEL_SLOT = keccak256("multisig.riskLevel");
    bytes32 private constant COMPANY_SLOT = keccak256("multisig.company");

    // Events
    event WeightChanged(address indexed owner, uint256 weight);
    event ThresholdChanged(uint256 threshold);
    event RiskLevelChanged(uint256 riskLevel);
    event TransactionRejected(bytes32 indexed txHash, uint256 totalRejectionWeight);
    event TransactionApproved(bytes32 indexed txHash);
    event OwnerChanged(address indexed owner);
    event CompanyChanged(address indexed company);
    

    // Risk levels
    uint256 public constant RISK_LOW = 10;     // 10% rejection weight
    uint256 public constant RISK_BALANCED = 20; // 20% rejection weight (default)
    uint256 public constant RISK_HIGH = 30;     // 30% rejection weight
    uint256 public constant RISK_VERY_HIGH = 40; // 40% rejection weight

    // Maximum company weight (49%)
    uint256 public constant MAX_COMPANY_WEIGHT = 49;
    
    // Maximum user weight (51%)
    uint256 public constant MAX_USER_WEIGHT = 51;

    // Default threshold (50%)
    uint256 public constant DEFAULT_THRESHOLD = 50;

    /**
     * @dev Initialize the multi-signature manager
     * @param _userAddress The address of the user (wallet owner)
     * @param _companyAddress The address of the company (security provider)
     * @param _riskLevel The initial risk level (default: RISK_BALANCED)
     */
    function initialize(
        address _userAddress,
        address _companyAddress,
        uint256 _riskLevel
    ) external {
        require(_getOwner() == address(0), "Already initialized");
        require(_getCompany() == address(0), "Already initialized");
        require(_userAddress != address(0), "Invalid user address");
        require(_companyAddress != address(0), "Invalid company address");
        
        // Set default risk level if not specified
        uint256 riskLevel = _riskLevel == 0 ? RISK_BALANCED : _riskLevel;
        
        _setOwner(_userAddress);
        _setCompany(_companyAddress);

        
        // Set default threshold to 50%
        _setThreshold(DEFAULT_THRESHOLD);
        
        // Set risk level
        _setRiskLevel(riskLevel);
    }

    /**
     * @dev Check if a transaction should be rejected based on signatures
     * @param _txHash The hash of the transaction
     * @param _signatures The rejection signatures
     * @return rejected True if the transaction should be rejected
     */
    /**
     * @dev Check if a transaction should be rejected based on user and company weights
     * @param _txHash The hash of the transaction
     * @param _userWeight The user's rejection weight for this transaction
     * @param _companyWeight The company's rejection weight for this transaction
     * @param _userSignature The user's signature for the transaction and weights
     * @param _companySignature The company's signature for the transaction and weights
     * @return rejected True if the transaction should be rejected
     */
    function checkRejection(
        bytes32 _txHash,
        uint256 _userWeight,
        uint256 _companyWeight,
        bytes memory _userSignature,
        bytes memory _companySignature
    ) external view returns (bool rejected) {
        // Create a hash that includes the transaction hash and both weights
        bytes32 weightedTxHash = keccak256(abi.encodePacked(_txHash, _userWeight, _companyWeight));
        
        // Recover signers from signatures
        address userSigner = recoverSigner(weightedTxHash, _userSignature);
        address companySigner = recoverSigner(weightedTxHash, _companySignature);
        
        
        // Verify that one signer is the user (weight >= 51) and one is the company (weight <= 49)
        bool hasValidUser = false;
        bool hasValidCompany = false;
        
        if (_userWeight <= MAX_USER_WEIGHT) {
            hasValidUser = true;
        }
        
        if (_companyWeight <= MAX_COMPANY_WEIGHT) {
            hasValidCompany = true;
        }
        
        require(hasValidUser && hasValidCompany, "Invalid weights");
        
        // Calculate total rejection weight
        uint256 totalRejectionWeight = _userWeight + _companyWeight;
        
        // If total rejection weight is greater than or equal to 50, reject the transaction
        return totalRejectionWeight >= 50;
    }




    // The changeWeight function has been removed as per requirements
    // Each transaction now uses dynamic weights provided with signatures

    /**
     * @dev Change the rejection threshold
     * @param _threshold The new threshold
     */
    function changeThreshold(uint256 _threshold) external onlyOwner {
        require(_threshold > 0 && _threshold <= 100, "Threshold must be between 1 and 100");
        
        _setThreshold(_threshold);
    }

    /**
     * @dev Change the risk level
     * @param _riskLevel The new risk level
     */
    function changeRiskLevel(uint256 _riskLevel) external onlyOwner {
        require(
            _riskLevel == RISK_LOW || 
            _riskLevel == RISK_BALANCED || 
            _riskLevel == RISK_HIGH || 
            _riskLevel == RISK_VERY_HIGH,
            "Invalid risk level"
        );
        
        _setRiskLevel(_riskLevel);
    }

    /**
     * @dev Get the current risk level
     * @return The current risk level
     */
    function getRiskLevel() external view returns (uint256) {
        return _getRiskLevel();
    }



    /**
     * @dev Get the current threshold
     * @return The current threshold
     */
    function getThreshold() external view returns (uint256) {
        return _getThreshold();
    }

    function  getOwner() external view returns (address) {
        return _getOwner();
    }

    function setOwner(address _owner) external onlyOwner {
        _setOwner(_owner);
        emit OwnerChanged(_owner);
    }


    function getCompany() external view returns (address) {
        return _getCompany();
    }

    function setCompany(address _company) external onlyOwner {
        _setCompany(_company);
        emit CompanyChanged(_company);
    }

    function _getCompany() internal view returns (address company) {
        bytes32 slot = COMPANY_SLOT;
        assembly {
            company := sload(slot)
        }
    }

    function _setOwner(address _owner) internal {
        bytes32 slot = OWNER_SLOT;
        assembly {
            sstore(slot, _owner)
        }
    }

    function _setCompany(address _company) internal {
        bytes32 slot = COMPANY_SLOT;
        assembly {
            sstore(slot, _company)
        }
    }

    function _getOwner() internal view returns (address owner) {
        bytes32 slot = OWNER_SLOT;
        assembly {
            owner := sload(slot)
        }
    }
    /**
     * @dev Recover the signer from a signature
     * @param _hash The hash that was signed
     * @param _signature The signature
     * @return The address of the signer
     */
    function recoverSigner(bytes32 _hash, bytes memory _signature) public pure returns (address) {
        require(_signature.length == 65, "Invalid signature length");
        
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }
        
        // Version of signature should be 27 or 28, but some wallets use 0 or 1
        if (v < 27) {
            v += 27;
        }
        
        require(v == 27 || v == 28, "Invalid signature 'v' value");
        
        // Recover the signer address
        return ecrecover(_hash, v, r, s);
    }


    function _setThreshold(uint256 _threshold) internal {
        bytes32 slot = THRESHOLD_SLOT;
        assembly {
            sstore(slot, _threshold)
        }
        
        emit ThresholdChanged(_threshold);
    }

    function _setRiskLevel(uint256 _riskLevel) internal {
        bytes32 slot = RISK_LEVEL_SLOT;
        assembly {
            sstore(slot, _riskLevel)
        }
        
        emit RiskLevelChanged(_riskLevel);
    }

    function _getThreshold() internal view returns (uint256 threshold) {
        bytes32 slot = THRESHOLD_SLOT;
        assembly {
            threshold := sload(slot)
        }
    }

    function _getRiskLevel() internal view returns (uint256 riskLevel) {
        bytes32 slot = RISK_LEVEL_SLOT;
        assembly {
            riskLevel := sload(slot)
        }
    }

    // Modifier to restrict access to owners
    modifier onlyOwner() {
        require(msg.sender ==_getOwner(), "Not an owner");
        _;
    }
}