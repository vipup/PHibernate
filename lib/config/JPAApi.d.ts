/**
 * Created by Papa on 6/28/2016.
 */
export declare enum CascadeType {
    ALL = 0,
    DETACH = 1,
    MERGE = 2,
    PERSIST = 3,
    REFRESH = 4,
    REMOVE = 5,
}
export declare enum FetchType {
    EAGER = 0,
    LAZY = 1,
}
export declare enum GenerationType {
    TABLE = 0,
    SEQUENCE = 1,
    IDENTITY = 2,
    AUTO = 3,
}
export declare enum AccessType {
    FIELD = 0,
    PROPERTY = 1,
}
export interface ManyToOneElements {
    cascade?: CascadeType;
    fetch?: FetchType;
    optional?: boolean;
}
export interface OneToManyElements {
    cascade?: CascadeType;
    fetch?: FetchType;
    mappedBy?: string;
    orphanRemoval?: boolean;
}
