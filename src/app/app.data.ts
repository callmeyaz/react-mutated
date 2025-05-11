export type User = {
  name: {
    firstname: string,
    lastname: string
  },
  roles: string[],
  address: string
};

export const user = {
  name: {
    firstname: "",
    lastname: ""
  },
  roles: [],
  address: ""
} as User;