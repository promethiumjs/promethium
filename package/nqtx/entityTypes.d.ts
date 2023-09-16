export declare type OptionalLiteralKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : {} extends Pick<T, K> ? K : never]: 0;
};
export declare type RequiredLiteralKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : {} extends Pick<T, K> ? never : K]: 0;
};
export declare type Deletable = symbol & number & string & {
    deletable: true;
};
//# sourceMappingURL=entityTypes.d.ts.map