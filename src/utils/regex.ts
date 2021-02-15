export const regex = {
    mentions: {
        CHANNEL: /^<#([0-9]+)>$/,
        USER: /^<@([0-9]+)>$/,
    },
    FLAG: /^\|?\|?(flag\{[A-Za-z0-9_]+\})\|?\|?$/,
    CHALLENGE_ID: /0x([0-9a-f]{4})/,
    COMMAND: /^([\w|\-]+)/,
};
