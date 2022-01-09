declare type Options = {
    template?: string;
    install: boolean;
    npm: boolean;
    yarn: boolean;
    yes: boolean;
    name?: string;
};
export declare function actionAsync(incomingProjectRoot: string, command: Partial<Options>): Promise<void>;
export declare function initGitRepoAsync(root: string, flags?: {
    silent: boolean;
    commit: boolean;
}): Promise<boolean>;
export {};
