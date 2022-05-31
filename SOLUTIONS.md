![](cover.png)

# Solutions

1. Unstoppable

   > Error in assert `assert(poolBalance == balanceBefore)`, just send 1 token to the pool directly.

2. Naive receiver

   > It is possible to call `flashLoan(address borrower, uint256 borrowAmount)` with receiver address and zero amount from another contract. Receiver will pay the fee every time its called, eventually draining all balance. See [NaiveExploit.sol](contracts/attacker-contracts/NaiveExploit.sol) for the implementation.

3. Truster

   > It is possible to call flashload function with token address as a target and any payload. We can't change the balance of the pool due to guards, but we can approve any amount of tokens on behalf of the pool itself. See [TrusterExploit.sol](contracts/attacker-contracts/TrusterExploit.sol) for the implementation.

4. Side entrance

   > Pool allows to deposit, we can use it to bypass flashloan guards as it check pool balance at the end. See [SideExploit.sol](contracts/attacker-contracts/SideExploit.sol) for the implementation.

5. The rewarder

   > Snapshotting for rewards is bad. We can flashloan lp tokens, deposit and immediately withdraw em successfully grabbing most of the rewards. See [RewarderExploit.sol](contracts/attacker-contracts/RewarderExploit.sol) for the implementation.

6. Selfie

   > Almost the same as above. Flashload > Snapshot > Propose. See [SelfieExploit.sol](contracts/attacker-contracts/SelfieExploit.sol) for the implementation.

7. Compromised

   > The leak is a group of bytes, which we can tranform to string, which looks like a base64 encoded string, after decoding we will get 2 private keys for trusted oracles. Using this 2 keys we can manipulate the price of the nft. Set price to 1 wei, buy the token, set price to exchange balance and sell the token to clear balance of the exchange contract. Note: You have to use `approve` function, as exchange contract only checks `_tokenApprovals` and not `_operatorApprovals`.

8. Puppet

9. Puppet v2

10. Free rider

11. Backdoor

12. Climber
