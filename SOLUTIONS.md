![](cover.png)

# Solutions

1. Unstoppable

   > Error in assert `assert(poolBalance == balanceBefore)`, just send 1 token to the pool directly.

2. Naive receiver

   > It is possible to call `flashLoan(address borrower, uint256 borrowAmount)` with receiver address and zero amount from another contract. Receiver will pay the fee every time its called, eventually draining all balance. See [NaiveExploit.sol](contracts/attacker-contracts/NaiveExploit.sol) for the implementation.

3. Truster

4. Side entrance

5. The rewarder

6. Selfie

7. Compromised

8. Puppet

9. Puppet v2

10. Free rider

11. Backdoor

12. Climber
