// -> Importaciones
const Follow = require("../models/Follow");
// <- Importaciones

const followUserIds = async (identityUserId) => {
    try
    {
        let following = await Follow.find({ user_id_follow: identityUserId })
                                    .select({ "user_id_followed": 1 })
                                    .populate("user_id_follow", "-password -role -__v");
        if (!following) throw new Error("error en el follow-user-ids");

        let follower = await Follow.find({ user_id_followed: identityUserId })
                                    .select({ "user_id_follow": 1 })
                                    .populate("user_id_followed", "-password -role -__v");
        if (!follower) throw new Error("error en el follow-user-ids");

        let followingClean = [];
        let followerClean = [];

        following.forEach(follow => {
            followingClean.push(follow.user_id_followed);
        });

        follower.forEach(follow => {
            followerClean.push(follow.user_id_follow);
        });
        
        return {
            following: followingClean,
            follower: followerClean
        }
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "error en el follow-user-ids"
        })
    }

}

const followThisUser = async (identityUserId, profileUserId) => {
    try
    {
        let following = await Follow.findOne({ user_id_follow: identityUserId, user_id_followed: profileUserId })
                                    .populate("user_id_follow", "-password -role -__v");
        if (!following) throw new Error("error en el follow-user-ids");

        let follower = await Follow.findOne({ user_id_follow: profileUserId, user_id_followed: identityUserId })
                                    .populate("user_id_followed", "-password -role -__v");
        if (!follower) throw new Error("error en el follow-user-ids");

        return {
            following,
            follower
        }

    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "error en el follow-user-ids"
        })
    }
}

module.exports = { followUserIds, followThisUser }