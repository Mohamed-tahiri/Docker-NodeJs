const e = require('express');
const Post = require('../models/post.model');

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        
        res.status(200).json({
            status: 'success',
            results: posts.length,
            posts
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
        });
    }
};


const getOnePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);
        
        res.status(200).json({
            status: 'success',
            post
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
        });
    }   
}

const createPost = async (req, res) => {
    const { title, body } = req.body
    
    //Confirm data
    if ( !title || !body ) {
        res.status(400).json({
            status: 'fail',
            message: 'All fields are required!'
        });    
    }

    // Check for duplicate
    const duplicate = await Post.findOne({ title })
        .collation({ locale: 'en' , strength: 2 })
        .lean()
        .exec()

    if (duplicate) {
        return res.status(409).json(
            { message: 'Duplicate title' }
        )
    }

    try {

        const post = await Post.create({
            title,
            body
        });
        
        res.status(200).json({
            status: 'success',
            post
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: e.message
        });
    }   
}

const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, body } = req.body;
    
    try {

        const post = await Post.findByIdAndUpdate(id,{title, body}, {
            new: true,
        })
        
        res.status(200).json({
            status: 'success',
            post
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'fail',
        });
    }   
}

const deletePost = async (req, res) => {
    const { id } = req.params;
    
    try {

        const post = await Post.findByIdAndDelete(id);
        
        res.status(200).json({
            status: 'success',
            post
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
        });
    }   
}

module.exports = {
    getAllPosts,
    getOnePost,
    createPost,
    updatePost,
    deletePost
}
