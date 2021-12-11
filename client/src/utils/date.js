import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";


export const formatCreatedAt = (timestamp) => {
    return formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true });
}
