import * as prismic from '@prismicio/client';

export function createClient(config = {}) {
    const client = prismic.createClient('https://diegofrr.prismic.io/api/v2', {
        ...config,
    })

    return client;
}