import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { Client } from "@prisma/client";
import { Form } from "../form";
import { useRouter } from "next/router";
import { TextField } from "../form/TextField";
import { Card } from "../design-system/Card";
import { Text, Badge, Flex, ListItem, Avatar, Box } from "../design-system";
import { Button } from "../Button";

export const ClientAddForm = () => {
  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().optional(),
    company: z.string().optional(),
    number: z.string().optional(),
  });

  const defaultValues = {
    name: "",
  };

  const ctx = trpc.useContext();
  const router = useRouter();

  const createMutation = trpc.useMutation(["client.create"], {
    onSuccess: () => {
      router.push("/clients");
      // ctx.refetchQueries(["client.get"]);
    },
  });

  const submit = (data: Client) => {
    console.log(data);
    // reset();
    createMutation.mutate({
      name: data.name,
      email: data.email,
      number: data.number,
      company: data.company,
    });
  };

  return (
    <Form
      schema={schema}
      defaultValues={defaultValues}
      onSubmit={submit}
      onError={(e) => console.log(e)}
    >
      <Flex direction={"column"} gap="2">
        <Flex align={"center"} gap={3}>
          <Avatar size={"4"}></Avatar>
          <Flex direction={"column"} gap={1}>
            <TextField name="name" size={3} placeholder="Name" />
            <TextField name="company" placeholder="company" />
          </Flex>
        </Flex>
        <Card css={{ p: "$2" }}>
          <ListItem gap={2}>
            <span className="text-sm font-semibold">Email</span>
            <TextField
              className="text-right"
              type="email"
              name="email"
              size={1}
              variant="ghost"
              placeholder="email"
            />
          </ListItem>
          <ListItem gap={2}>
            <span className="text-sm font-semibold">Number</span>
            <TextField
              className="text-right"
              type="tel"
              size={1}
              name="number"
              variant="ghost"
              placeholder="number"
            />
          </ListItem>
        </Card>
        <Button type="submit" color="green" variant={"green"}>
          Submit
        </Button>
      </Flex>
    </Form>
  );
};
