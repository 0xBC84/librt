import { Server } from "socket.io";
import { SignClient } from "@walletconnect/sign-client";
import { getConfig } from "@librt/config";
import path from "node:path";
import {
  SignClientToServerEvents,
  SignInterServerEvents,
  SignServerToClientEvents,
  SignSocketData,
} from "@librt/core";

// @todo Use namespaces
(async () => {
  const io = new Server<
    SignClientToServerEvents,
    SignServerToClientEvents,
    SignInterServerEvents,
    SignSocketData
  >();

  const { wallet, storage } = getConfig();
  const dbPath = storage.path.replace("$HOME", process.env.HOME || "");
  const db = path.resolve(dbPath);

  const signClient = await SignClient.init({
    metadata: wallet.walletConnect.metadata,
    projectId: wallet.walletConnect.projectId,
    relayUrl: wallet.walletConnect.relayUrl,
    storageOptions: {
      database: db,
    },
  });

  if (!signClient) throw Error("could not init client");

  io.use(async (socket, next) => {
    socket.data.signClient = signClient;
    next();
  });

  io.on("connection", (socket) => {
    socket.emit("sign_client:ready");

    socket.on("sign_client:pair", async (data) => {
      try {
        if (!socket.data.signClient) return;
        await socket.data.signClient.pair(data);
        socket.emit("sign_client:pair_ok");
      } catch (e: any) {
        console.error(e);
      }
    });

    io.on("sign_client:session_proposal", (data) => {
      socket.emit("sign_client:session_proposal", data);
    });

    socket.on("sign_client:session_approve", async (data) => {
      try {
        if (!socket.data.signClient) return;
        const { acknowledged } = await socket.data.signClient.approve(data);
        await acknowledged();
        socket.emit("sign_client:session_approve_ok");
      } catch (e) {
        console.error(e);
      }
    });
  });

  signClient.on("session_proposal", (data) => {
    io.emit("sign_client:session_proposal", data);
  });

  signClient.on("session_request", (data) => {
    io.emit("sign_client:session_request", data);
  });

  signClient.on("session_ping", (data) => {
    io.emit("sign_client:session_ping", data);
  });

  signClient.on("session_event", (data) => {
    io.emit("sign_client:session_event", data);
  });

  signClient.on("session_update", (data) => {
    io.emit("sign_client:session_update", data);
  });

  signClient.on("session_delete", (data) => {
    io.emit("sign_client:session_delete", data);
  });

  io.listen(3000);

  // eslint-disable-next-line no-console
  console.log("listening...");
})();
