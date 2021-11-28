import axios from 'axios';

export const client = axios.create({
    baseURL: '/api/v1'
})

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
        })
}

export const signoutUser = async () => { }

export const updateUser = async () => { }

export const addVideoView = async () => { }

export const addComment = async () => { }

export const addVideo = async () => { }

export const toggleSubscribeUser = async () => { }

export const likeVideo = async () => { }

export const dislikeVideo = async () => { }

export const deleteVideo = async () => { }

export const deleteComment = async () => { }
