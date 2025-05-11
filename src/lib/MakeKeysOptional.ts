type _<T> = T extends {} ? { [k in keyof T]: T[k]; } : T;
type OptionalKeys<T extends {}> = {
    [k in keyof T]: undefined extends T[k] ? k : never;
}[keyof T];
type RequiredKeys<T extends object> = Exclude<keyof T, OptionalKeys<T>>;
type MakePartial<T extends object> = {
    [k in OptionalKeys<T> as T[k] extends never ? never : k]?: T[k];
} & {
    [k in RequiredKeys<T> as T[k] extends never ? never : k]: T[k];
};
type AnyObject = { [k: string]: any; };
type Maybe<T> = T | null | undefined;
export type MakeKeysOptional<T> = T extends AnyObject ? _<MakePartial<T>> : T extends Maybe<T> ? T | null | undefined : T;