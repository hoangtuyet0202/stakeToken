// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    using SafeMath for uint256;
    event ClaimedEvent(address from, uint amount, uint256 timestamp);
    event StakeEvent(address from, uint amount, uint256 timestamp);
    event UnstakeEvent(address from, uint amount, uint256 timestamp);
    event WithdrawEvent(address from, uint256 timestamp);
    constructor(uint256 initialSupply) ERC20("My Token", "MTK") {
        _mint(msg.sender, initialSupply);
    }

    function mint(uint256 amount) public  {
        _mint(msg.sender, amount);
        emit ClaimedEvent(msg.sender, amount, block.timestamp);
    }

    // stakeholder
    address[] internal stakeholders;
    function isStakeholder(address _address) public view returns(bool, uint256) {
        for(uint256 i = 0; i < stakeholders.length; i++) {
            if(_address == stakeholders[i]) return (true, i);
        }
        return (false, 0);
    }
    function addStakeholder(address _stakeholder) public {
        (bool _isStakeholder, ) = isStakeholder(_stakeholder);
        if(!_isStakeholder) stakeholders.push(_stakeholder);
    }
    function removeStakeholder(address _stakeholder) public {
        (bool _isStakeholder, uint256 i) = isStakeholder(_stakeholder);
        if(_isStakeholder) {
            stakeholders[i] = stakeholders[stakeholders.length - 1];
            stakeholders.pop();
        }
    }

    // stakes
    mapping(address => uint256) internal stakes;
    function stakeOf(address _stakeholder) public view returns(uint256) {
        return stakes[_stakeholder];
    }
    function totalStakes() public view returns(uint256) {
        uint256 _totalStakes = 0;
        for(uint256 i = 0; i< stakeholders.length; i++) {
            _totalStakes = _totalStakes.add(stakes[stakeholders[i]]);
        }
        return _totalStakes;
    }
    function createStake(uint256 _stake) public {
        _burn(msg.sender, _stake); //chuyển _stake vào address sender
        if(stakes[msg.sender] == 0) addStakeholder(msg.sender);
        stakes[msg.sender] = stakes[msg.sender].add(_stake);
        distributeRewards();
        emit StakeEvent(msg.sender, _stake, block.timestamp);

    }
    function removeStake(uint256 _stake) public {
        stakes[msg.sender] = stakes[msg.sender].sub(_stake);
        if(stakes[msg.sender] == 0) removeStakeholder(msg.sender);
        _mint(msg.sender, _stake);
        distributeRewards();
        emit UnstakeEvent(msg.sender, _stake, block.timestamp);
    }

    // rewards
    mapping(address => uint256) internal rewards;
    function rewardOf(address _stakeholder) public view returns(uint256) {
        return rewards[_stakeholder];
    }
    function totalRewards() public view returns(uint256) {
        uint256 _totalRewards = 0;
        for(uint256 i = 0; i< stakeholders.length ; i++) {
            _totalRewards = _totalRewards.add(rewards[stakeholders[i]]);
        }
        return _totalRewards;
    }
    function calculateReward(address _stakeholder) public view returns(uint256) {
        return stakes[_stakeholder] /100;
    }
    function distributeRewards() public {
        for(uint256 i = 0; i< stakeholders.length; i++) {
            address stakeholder = stakeholders[i];
            uint256 reward = calculateReward(stakeholder);
            rewards[stakeholder] = rewards[stakeholder].add(reward);
        }
    }
    function withdrawReward() public {
        uint256 reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        _mint(msg.sender, reward);
        emit WithdrawEvent(msg.sender, block.timestamp);
    }
}