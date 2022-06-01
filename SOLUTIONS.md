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

   > Pretty easy solution, we just sell all our tokens (except 1 wei) to the Uniswap pool, this will shift the price significantly, then just borrow everything from the lending pool. We can do this in the smart contract, but its not really necessary for this challenge.

9. Puppet v2

   > Same as above, but uses Uniswap V2, not sure maybe I'm doing something wrong? To make it clear, the solution just empties the pool and don't care about ETH balance, we could optimize the math and make it way more efficient to keep our ether :) Also, in the real world you should put all this logic into the smart contract, so noone could frontrun you, this also applies to the previous challenge.

10. Free rider

    > This was fun! The bug which we can exploit is inside `buyMany` function wich allows you to buy all tokens for the price of 1. But we need to get 15 ether somewhere. Fortunately there is a uniswap v2 pair deployed with enough liquidity. So the plan is to get flashloan from the pool, buy all NFTs, get the reward from the buyer contract and repay the loan. See [FreeRiderExploit.sol](contracts/attacker-contracts/FreeRiderExploit.sol) for the implementation.

11. Backdoor

    > After hours of exploring Gnosis contracts I found out that its possible to sneak delegatecall into the [safe setup function](https://github.com/safe-global/safe-contracts/blob/c36bcab46578a442862d043e12a83fec41143dec/contracts/GnosisSafe.sol#L69). This is used for some modules setup, but we can put our call here instead. But we cannot transfer tokens right away because registry contract callback called last, but we can preapprove tokens to our contract instance, and drain the safe afterwards. See [BackdoorExploit.sol](contracts/attacker-contracts/BackdoorExploit.sol) for the implementation. Note: As our contract called via delegatecall this means that we're in the context of proxy contract itself and cannot access any storage variables in our contract's context, to bypass this we can pass needed arguments to our callback functions.

12. Climber
