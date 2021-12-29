import axios from 'axios';
import { queryCache } from 'react-query';

export const client = axios.create({
    baseURL: '/api/v1'
});

export const authenticate = (response) => {
    client({
        method: 'POST',
        url: '/auth/google-login',
        data: { idToken: response.tokenId },
    })
        .then(resp => {
            console.log('Successful signin:', resp);
            window.location.assign(window.location.href);
        })
        .catch(error => {
            console.error("Unsuccessful signin:", error.resp);
        });
}

export const signoutUser = async () => {
    await client.get('/auth/signout');
    window.location.pathname = '/';
}

export const updateUser = async () => { }

export const addVideoView = async (videoId) => {
    await client.get(`/videos/${videoId}/view`);
    await queryCache.invalidateQueries('History');
}

export const addComment = async () => { }

export const addVideo = async (video) => {
    await client.post('/videos', video);
    await queryCache.invalidateQueries('Channel');
}

export const toggleSubscribeUser = async () => { }

export const likeVideo = async (videoId) => {
    await client.get(`/videos/${videoId}/like`);
    await queryCache.invalidateQueries(['WatchVideo', videoId]);
}

export const dislikeVideo = async (videoId) => {
    await client.get(`/videos/${videoId}/dislike`);
    console.log('dislike video', videoId)
    await queryCache.invalidateQueries(['WatchVideo', videoId]);
}

export const deleteVideo = async () => { }

export const deleteComment = async () => { }
