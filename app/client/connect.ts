import { io } from "socket.io-client";

(async () => {
  const uri = process.argv[2];
  const socket = io("ws://server:4000");

  await new Promise(() => {
    socket.on("sign_client:ready", () => {
      socket.emit("sign_client:connect", uri);

      socket.on("sign_client:session_proposal", (data) => {
        const methods = [
          "eth_requestAccounts",
          "eth_accounts",
          "eth_chainId",
          "eth_sendTransaction",
          "eth_signTransaction",
          "eth_sign",
          "eth_signTypedData",
          "personal_sign",
        ];

        const events = ["chainChanged", "accountsChanged"];

        const payload = {
          id: data.id,
          namespaces: {
            eip155: {
              accounts: [
                "eip155:42:0x2013b129bE01B884C112F715CA59a9E07D6a8C33",
              ],
              events,
              methods,
            },
          },
        };

        socket.emit("sign_client:session_approve", JSON.stringify(payload));
      });
    });
  });
})();
