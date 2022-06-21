import React, { useEffect, useState } from "react";
import { Command } from "@oclif/core";
import { Box, render, useApp, useFocusManager } from "ink";
import { format } from "date-fns";
import {
  Indicator,
  Layout,
  Options,
  OptionsProps,
  useIndicator,
} from "@librt/ui";
import EventEmitter from "node:events";
import { io, Socket } from "socket.io-client";
import {
  SignClientToServerEvents,
  SignServerToClientEvents,
  toDateCreated,
} from "@librt/core";
import { JsonRpcRecord } from "@walletconnect/types";

const CLI_EVENT_EXCEPTION = "exception";

const cli = new EventEmitter();

type SignClientSocket = Socket<
  SignServerToClientEvents,
  SignClientToServerEvents
>;

const SegmentOptions = ({
  events,
  socket,
}: {
  events: JsonRpcRecord[];
  socket: Socket;
}) => {
  const { exit } = useApp();
  const { focus } = useFocusManager();

  useEffect(() => {
    focus("event-list");
  }, []);

  const data: OptionsProps["data"] = events.map((event) => ({
    id: event.id.toString(),
    prefix: format(toDateCreated(event.id), "HH:mm dd.MM.yyyy"),
    label: event.request.method,
  }));

  const handleSubmit = () => {
    socket.disconnect();
    exit();
  };

  const handleCancel = () => {
    socket.disconnect();
    exit();
  };

  return (
    <Box marginTop={1}>
      <Options
        id="event-list"
        isSelectSingle={true}
        data={data}
        prefixJustify={true}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Box>
  );
};

const SegmentFetchEvents = ({ socket }: { socket: SignClientSocket }) => {
  const indicator = useIndicator({
    onTimeout: () => {
      cli.emit(CLI_EVENT_EXCEPTION, "request timed out");
    },
    onLoad: () => {
      return new Promise((resolve) => {
        socket.emit("sign_client:event_list");
        socket.on("sign_client:event_list", () => {
          resolve(true);
        });
      });
    },
  });

  return (
    <Indicator
      indicator={indicator}
      label="fetching events"
      key="do-fetch-events"
    />
  );
};

const SegmentConnect = ({
  onConnect,
}: {
  onConnect: (socket: SignClientSocket) => void;
}) => {
  const indicator = useIndicator({
    onTimeout: () => {
      cli.emit(CLI_EVENT_EXCEPTION, "request timed out");
    },
    onLoad: () => {
      return new Promise((resolve) => {
        const _socket = io("ws://node:3000");
        _socket.on("sign_client:ready", () => {
          resolve(true);
          onConnect(_socket);
        });
      });
    },
  });

  return (
    <Indicator indicator={indicator} label="connecting" key="do-connects" />
  );
};

const EventList = () => {
  const [components, setComponents] = useState<React.ReactNode[]>([]);
  const [socket, setSocket] = useState<SignClientSocket | undefined>();

  useEffect(() => {
    setComponents((components: React.ReactNode[]) => [
      ...components,
      <SegmentConnect
        key="do-connect"
        onConnect={(socket) => {
          setSocket(socket);
        }}
      />,
    ]);
  }, []);

  useEffect(() => {
    if (socket) {
      setComponents((components: React.ReactNode[]) => [
        ...components,
        <SegmentFetchEvents key="do-pair-proposal" socket={socket} />,
      ]);
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.once("sign_client:event_list", (events) => {
        setComponents((components: React.ReactNode[]) => [
          ...components,
          <SegmentOptions key="event-list" events={events} socket={socket} />,
        ]);
      });
    }
  }, [socket]);

  return <>{components}</>;
};

// @todo Disconnect.
export default class EventListCommand extends Command {
  static description = "Create a pair connection.";

  static examples = [`$ librt event:list`];

  static flags = {};

  static args = [];

  async run(): Promise<void> {
    // const { flags } = await this.parse(EventListCommand);
    render(
      <>
        <Layout>
          <EventList />
        </Layout>
      </>
    );
  }
}
