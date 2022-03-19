import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("Fortune", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default func;

func.tags = ["fortune"];
