export declare type OptionalLiteralKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : {} extends Pick<T, K> ? K : never]: 0;
};
export declare type Deletable = string & {
    deletable: true;
};
//# sourceMappingURL=entityTypes.d.ts.map