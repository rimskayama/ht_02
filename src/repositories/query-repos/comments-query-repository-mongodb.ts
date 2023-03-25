import {ObjectId, SortDirection} from "mongodb";
import {commentsCollection} from "../db";
import {commentsPaginationViewModel} from "../../models/pagination-view-models";
import {commentsMapping} from "../../functions/mapping";
import {commentModelWithMongoId, commentViewModelWithId} from "../../models/comments-view-model";

export const commentsQueryRepository = {

    async findComments(
        page: number, limit: number, sortDirection: SortDirection,
        sortBy: string, skip: number): Promise<commentsPaginationViewModel> {
        let allComments = await commentsCollection.find(
            {}, {})
            .skip(skip)
            .limit(limit)
            .sort({[sortBy]: sortDirection})
            .toArray()

        const total = await commentsCollection.countDocuments()

        const pagesCount = Math.ceil(total / limit)

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: total,
            items: commentsMapping(allComments)
        }
    },

    async findCommentById(_id: ObjectId): Promise<commentViewModelWithId | null> {
        const comment: commentModelWithMongoId | null = await commentsCollection.findOne({_id});
        if (!comment) {
            return null;
        }
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt,
        };
    },
}