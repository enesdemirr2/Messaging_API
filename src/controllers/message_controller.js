const {validationResult} = require('express-validator');
const connection  = require('../../config/db');


const Message = require('../../models/messages');
const BlockedUser = require('../../models/blocked_users');

const Participants = require('../../models/participants');
const { text } = require('body-parser');
const Conversation = require('../../models/conversation');
const User = require('../../models/user');
const { Op } = require('sequelize');




const sendMessage = (req, res, next) => {

    res.status(200).json({'SentMessage' : 'Message Page'})
}


const sendMessages = async (req, res, next) => {
    const _bulunanUser = await User.findOne({
        where : {username : req.params.username}
    })
    

    
    const blockUser = await BlockedUser.findOne({
        where: {
            [Op.or]:
            [
                {
                    user_id: req.user.id,
                    target_user_id: _bulunanUser.id
                },
                {
                    user_id: _bulunanUser.id,
                    target_user_id: req.user.id,
                }
            ]
        }
    });

    if (blockUser){
        
        res.status(403).json("Bu kullanıcı tarafından engellendiniz veya bu kullanıcıyı engellediniz.");

    } else {

        const [results, metadata] = await connection.query(`SELECT messages.conversation_id FROM messages INNER JOIN participants ON messages.conversation_id = participants.conversation_id WHERE (messages.user_id = ${req.user.id} AND participants.user_id = ${_bulunanUser.id}) or (messages.user_id = ${_bulunanUser.id} AND participants.user_id = ${req.user.id});`);

    let conversation;

    if (results.length > 0){
        conversation = await Conversation.findOne({
            where: {
                id: results[0].conversation_id
            }
        })
    } else{
        conversation = await Conversation.create({})

        const participants1 = new Participants({
            user_id : _bulunanUser.id,
            conversation_id : conversation.id
         })
         await participants1.save();

         const participants2 = new Participants({
            user_id : req.user.id,
            conversation_id : conversation.id
         })
         await participants2.save();
    }

    const message = await Message.create ({
        user_id : req.session.passport.user,
        text : req.body.message,
        conversation_id : conversation.id
       
    })

    console.log(_bulunanUser.email);
    
    res.status(200).json({
        response: "Gönderildi.",
        target_username: _bulunanUser.username,
        message: req.body.message,
        time: message.createdAt.toLocaleDateString() + ' - ' + message.createdAt.toLocaleTimeString()
    });
        
  }

}

const getMessages = async (req, res) => {

    const conversations = await Conversation.findAll({

        where: {
            is_deleted: 0
        },
        include: {
            model: User,
            where: {
                id: req.user.id
            }
        }
    });
    console.log("conversations------------");
    console.log(conversations);

    let active_conversation_ids = [];
    conversations.forEach(element => {
        active_conversation_ids.push(element.id);
    });
    console.log("active_conversations_id--------");
    console.log(active_conversation_ids);
    
    const active_conversations = await Conversation.findAll({
        where: {
            id: {
                [Op.in]: active_conversation_ids
            },
            is_deleted: 0
        },
        include: {
            model: User
        },
        include: {
            model: Message
        },
        order: [
            ['updatedAt', 'DESC'],
        ],
    });

    res.json(active_conversations);

}

const messagesContent = async (req, res) => {

    //Bulunan User
    const _bulunanUser = await User.findOne({
        where: {
            username: req.params.username,
            is_deleted: 0
        }
    });
    console.log(_bulunanUser.email);

    const [results, metadata] = await connection.query(`SELECT messages.conversation_id 
    FROM messages INNER JOIN participants ON messages.conversation_id = 
    participants.conversation_id WHERE (messages.user_id = ${req.user.id} 
    AND participants.user_id = ${_bulunanUser.id}) or (messages.user_id = ${_bulunanUser.id} 
    AND participants.user_id = ${req.user.id});`);
    console.log(results);

    if (results.length > 0) {
        const conversation = await Message.findAll({
            where: {
                conversation_id : results[0].conversation_id
            }
            
        });
        console.log(conversation);
        res.json(conversation)

    } else {
        res.json("Bu kullanıcı ile aranızda bir konuşma yok!")
    }
    
}

const blockUser = async (req, res) => {

    const _bulunanUser = await User.findOne({
        where : {
            username: req.params.username,
            is_deleted: 0
        }
        
    });
    console.log("req.user.id");
    console.log(req.user.id);
    console.log("_bulunanUser.id");
    console.log(_bulunanUser.id);

    const blocked_before = await BlockedUser.findOne({
        where: {
            [Op.or]:
            [
                {
                    user_id: req.user.id,
                    target_user_id: _bulunanUser.id
                },
                {
                    user_id: _bulunanUser.id,
                    target_user_id: req.user.id
                }
            ]
        }
    });
    
    if(blocked_before){
        res.json({
            response: false,
            message: "Kullanıcı zaten bloklandı",
            target: req.params.username
        });

    } else {
         blocked_users = await BlockedUser.create({
            user_id: req.user.id,
            target_user_id: _bulunanUser.id,
        })
        res.json({
            response: true,
            message: "Bloklama işlemi başarılı",
            target: req.params.username
        })
    }

}

const isItBlocked = async (req, res) => {

    const _bulunanUser = await User.findOne({
        where: {
            username: req.params.username,
            is_deleted:0
        }
    })
    console.log("req.user.id");
    console.log(req.user.id);
    console.log("_bulunanUser.id");
    console.log(_bulunanUser.id);

    isItBlockedBefore = await BlockedUser.findOne({
        where: {
            is_deleted: 0,
            [Op.or]:
            [
                {
                    user_id: req.user.id,
                    target_user_id: _bulunanUser.id,
                },
                {
                    user_id: _bulunanUser.id,
                    target_user_id: req.user.id
                }
            ]
        }
    })
    if (isItBlockedBefore) {

        res.json({
            response: true,
            message: "Kullanıcı blok durumunda",
            target: req.params.username
        });
        
    } else {
        res.json({
            response: false,
            message: "Kullanıcı bloklanmadı",
            target: req.params.username
        });
        
    }
}

const unblockUser = async (req, res) => {

    const _bulunanUser = await User.findOne({
        where: {
            username: req.params.username,
            is_deleted: 0
        }
    });

    const isItBlockedBefore = await BlockedUser.findOne({
        where: {
            is_deleted: 0,
            [Op.or]: 
            [
                {
                    user_id: req.user.id,
                    target_user_id : _bulunanUser.id,
                },
                {
                    user_id: _bulunanUser.id,
                    target_user_id: req.user.id,
                }
            ]
        }
    });

    if(isItBlockedBefore) {
        isItBlockedBefore.destroy();
        res.json({
            response: true,
            message: "Kullanıcı bloğu kaldırıldı",
            target: req.params.username
        });

    } else {
        res.json({
            resposne: false,
            message: "Kullanıcı bloğu yok",
            target: req.params.username
        });
    }
}

const blockedList = async (req, res) => {

    const isItBlockedBefore = await BlockedUser.findAll({
        where: {
            is_deleted:0,
            user_id: req.user.id
        }
    })

    res.json(isItBlockedBefore)
}

const deleteMessage = async (req, res, next) => {

    const _bulunanMessage = await Message.findOne({
        where: {
            id: req.params.id
        }
    });

    

    if(_bulunanMessage) {

        _conversaiton_id = _bulunanMessage.dataValues.conversation_id;

        await Message.destroy({
            where: {
                id: req.params.id
            }
        });
        const checkMessages = await Message.findOne({
            where: {
                conversation_id : _conversaiton_id,
            }
        });
        if (!checkMessages) {
        
            Participants.destroy({
                where: {
                    conversation_id: _conversaiton_id
                }
            })
            Conversation.destroy({
                where: {
                    id: _conversaiton_id
                }
            })
        } else {
            
        }
        res.status(200).send();

    } else {
        
        res.status(404).send("Mesaj silme işlemi başarısız, mesaj bulunamadı");
    }
}


module.exports = {
    sendMessage,
    sendMessages,
    getMessages,
    messagesContent,
    blockUser,
    isItBlocked,
    unblockUser,
    blockedList,
    deleteMessage
}

