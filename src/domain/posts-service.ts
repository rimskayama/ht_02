import {postModelWithMongoId} from "../models/post-view-model";
import {postsRepository} from "../repositories/mongodb/posts-repository-mongodb";
import {ObjectId} from "mongodb";
import {blogsRepository} from "../repositories/mongodb/blogs-repository-mongodb";

export const postsService = {

    async createPost(title: string, shortDescription: string,
                     content: string, blogId: string) {

        let foundBlogByName = await blogsRepository.findBlogName(blogId.toString())

        if (foundBlogByName) {
            const newPost : postModelWithMongoId = {
                _id: new ObjectId(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: foundBlogByName._id.toString(),
                blogName: foundBlogByName.name,
                createdAt: (new Date()).toISOString(),
            }
            return await postsRepository.createPost(newPost);
        } else return null

    },

    async updatePost(_id: ObjectId, title: string, shortDescription: string,
                     content: string, blogId: string) {

        let foundBlogByName = await blogsRepository.findBlogName(blogId)

        if (foundBlogByName) {
            return await postsRepository.updatePost(_id, title, shortDescription, content, blogId);
        }

    },

    async deletePost(_id: ObjectId) {
        return await postsRepository.deletePost(_id);
    },

    async deleteAll() {
        return await postsRepository.deleteAll();
    }

}