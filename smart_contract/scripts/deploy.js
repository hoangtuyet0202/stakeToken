const main = async () => {
    const transactionsFactory = await hre.ethers.getContractFactory("MyToken");
    const transactionsContract = await transactionsFactory.deploy(100000);
  
    await transactionsContract.deployed();
  
    console.log("MyToken address: ", transactionsContract.address);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  runMain();