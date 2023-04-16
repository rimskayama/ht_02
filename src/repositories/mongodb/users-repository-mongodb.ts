import {userInputModel, userViewModelWithId} from "../../models/user-view-model";
import {ObjectId} from "mongodb";
import {usersCollection} from "../db";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

export const usersRepository = {

    async createUser (newUser : userInputModel): Promise<userViewModelWithId> {

        const result = await usersCollection.insertOne(newUser)
        return {
            id: newUser._id.toString(),
            login: newUser.accountData.login,
            email: newUser.accountData.email,
            createdAt: newUser.accountData.createdAt
        }
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<userInputModel | null> {

        const user: userInputModel | null = await usersCollection.findOne(
            {$or: [{"accountData.login": loginOrEmail}, {"accountData.email": loginOrEmail}]});

        if (!user) {
            return null
        }
        return user

    },

    async findByConfirmationCode(code: string): Promise<userInputModel | null> {
        const user: userInputModel | null = await usersCollection.findOne({"emailConfirmation.confirmationCode": code})
        return user || null
    },

    async updateConfirmation(_id: ObjectId) {
        const updatedCode = await usersCollection.updateOne({_id}, {
            $set:
                {
                    "emailConfirmation.isConfirmed": true
                }
        })
        return true
    },

    async updateConfirmationCode(_id: ObjectId) {
        const updatedCode = await usersCollection.updateOne({_id}, {
            $set:
                {
                    "emailConfirmation.confirmationCode": uuidv4(),
                    "emailConfirmation.expirationDate": add(new Date(),{
                        hours: 1,
                        minutes: 3
                    })
                }
        })
        return await usersCollection.findOne({_id})
    },

    async deleteUser(_id: ObjectId) {
        const user = await usersCollection.findOne({_id}, {projection: {_id: 0}});
        if (user) {
            return await usersCollection.deleteOne(user);
        }
        return null
    },

    async deleteAll() {
        return await usersCollection.deleteMany({},{});
    }

}