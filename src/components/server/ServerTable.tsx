import { trpc } from "../../utils/trpc";
import { Badge, Flex, Text } from "../design-system";
import { Table } from "../Table";

export const ServerTable = () => {
  type Server = {
    id: number;
    name: string;
    asset_number: string;
    status: string;
    location_id: number;
    location: string;
    brand_id: string;
    model: string;
    serial: string;
    mac_address: string;
    ip_address: string;
    port: number;
    data_purchased: Date;
  };

  const { data: servers } = trpc.useQuery("server.get");

  const columns = [
    {
      Header: "Server",
      id: "server",
      accessor: "name",
      minWidth: 200,
      Cell: (data: any) => (
        <Flex gap={5} direction="column">
          <Text>{data.row.original.name ?? ""}</Text>
          <Text>{data.row.original.asset_number}</Text>
        </Flex>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      minWidth: 100,
      Cell: (data: any) => {
        switch (data.row.original.status) {
          case "online":
            return (
              <Badge size={1} color="green">
                {data.row.original.status}
              </Badge>
            );
          case "offline":
            return (
              <Badge size={1} color="gray">
                {data.row.original.status}
              </Badge>
            );
          case "maintenance":
            return (
              <Badge size={1} color="yellow">
                {data.row.original.status}
              </Badge>
            );
        }
      },
    },
    {
      Header: "Brand",
      accessor: "brand.name",
    },
    {
      Header: "Model",
      accessor: "model",
    },

    {
      Header: "Location",
      accessor: "location.name",
      minWidth: 200,
    },
    {
      Header: "Network",
      id: "networkLocation",
      Cell: (data: any) => (
        <Flex gap={5} direction="column">
          <Text size="1">IP: {data.row.original.ipAddress}</Text>
          <Text size="1" color="gray">
            port: {data.row.original.port}
          </Text>
        </Flex>
      ),
    },
    {
      Header: "",
      id: "col13",
      minWidth: 120,
      maxWidth: 120,
      Cell: (data: any) => <Flex gap="5"></Flex>,
    },
  ];

  return (
    <Table<Server>
      data={servers ?? []}
      searchable
      selectable
      // pagination
      loading={servers == undefined}
      columns={columns}
      onRowClick={(row: Server) => {
        router.push(`/servers/${row.id}`);
      }}
    />
  );
};
