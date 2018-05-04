import {ChannelCallback, IChannel, IHandler} from "./index.d";

export class Channel implements IChannel {

    private static handlerIdCpt = 0;

    private static handlersById: {[key: number] : IHandler} = {};
    private static handlersByMessage: {[key: string]: IHandler[]} = {};

    public on(message: string, cb: ChannelCallback) {
        const handler = {
            id: Channel.handlerIdCpt++,
            cb: cb
        };

        Channel.handlersById[handler.id] = handler;

        let handlers = Channel.handlersByMessage[message];
        if (! handlers) {
            handlers = [];
            Channel.handlersByMessage[message] = handlers;
        }

        handlers.push(handler.id);

        return handler.id;
    }

    public emit(message: string, data: any) {
        let handlers = Channel.handlersByMessage[message];

        if (handlers != null) {
            for (let i = 0, len = handlers.length; i < len; i++) {
                const handlerId = handlers[i];

                const handler = Channel.handlersById[handlerId];
                if (handler) {
                    handler.cb(data);
                } else {
                    delete handlers[i];
                    i--;
                }
            }
        }
    }

    public off(handlerId: number) {
        if (Channel.handlersById[handlerId]) {
            delete Channel.handlersById[handlerId];
        }
    }
}
