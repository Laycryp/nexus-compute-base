// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NexusCompute
 * @dev Micro-Compute DePIN Layer for Base Network
 */
contract NexusCompute is ReentrancyGuard {
    
    struct Provider {
        address wallet;
        bool isActive;
        uint256 totalTasksCompleted;
    }

    struct Task {
        uint256 id;
        address developer;
        address provider;
        uint256 reward;
        string modelUri; 
        string resultUri; 
        bool isCompleted;
    }

    uint256 public nextTaskId;
    mapping(address => Provider) public providers;
    mapping(uint256 => Task) public tasks;

    event ProviderRegistered(address indexed provider);
    event TaskCreated(uint256 indexed taskId, address indexed developer, uint256 reward);
    event TaskCompleted(uint256 indexed taskId, address indexed provider, string resultUri);

    error NotActiveProvider();
    error InvalidReward();
    error TaskNotActive();
    error TransferFailed();

    function registerProvider() external {
        providers[msg.sender] = Provider(msg.sender, true, 0);
        emit ProviderRegistered(msg.sender);
    }

    function createTask(string calldata _modelUri) external payable {
        if (msg.value == 0) revert InvalidReward();

        uint256 taskId = nextTaskId++;
        tasks[taskId] = Task({
            id: taskId,
            developer: msg.sender,
            provider: address(0),
            reward: msg.value,
            modelUri: _modelUri,
            resultUri: "",
            isCompleted: false
        });

        emit TaskCreated(taskId, msg.sender, msg.value);
    }

    function completeTask(uint256 _taskId, string calldata _resultUri) external nonReentrant {
        if (!providers[msg.sender].isActive) revert NotActiveProvider();
        
        Task storage task = tasks[_taskId];
        if (task.isCompleted || task.reward == 0) revert TaskNotActive();

        task.isCompleted = true;
        task.provider = msg.sender;
        task.resultUri = _resultUri;

        providers[msg.sender].totalTasksCompleted += 1;

        (bool success, ) = msg.sender.call{value: task.reward}("");
        if (!success) revert TransferFailed();

        emit TaskCompleted(_taskId, msg.sender, _resultUri);
    }
}