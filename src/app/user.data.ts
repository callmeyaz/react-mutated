export type User = {
  name: {
    firstname: string,
    lastname: string
  },
  address: string
};

export const user = {
  name: {
    firstname: "",
    lastname: ""
  },
  address: ""
} as User;