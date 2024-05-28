import sendMail from '../../utils/sendmail'
import prisma from '../../lib/prisma';

export default async function handler(req,res) {
  if (req.method === 'POST') {
    try {
      const reqData = req.body
        const info = await sendMail(reqData);
        const newMailBody = await prisma.mailBody.create({
          data: reqData
        });
        console.log(info)
        if(info){
          let secondQueryData={
            mailId:newMailBody.id,
            resendMailId:info.id,
            type:'SENT',
            userId:newMailBody.userId
          }
          const mail = await prisma.mail.create({
            data:secondQueryData
          }); 
          console.log(mail)       
        }
        return res.json({
          message:"email send successfully"
        })
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
  } 
  if(req.method === 'GET'){
    try {
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const offset = (pageNumber - 1) * limitNumber;

      const sentMails = await prisma.mail.findMany({
        where: {
          type: 'SENT',
        },
        include: {
          mailbody: true,
        },
        skip: offset,
        take: limitNumber,
      });
      const totalSentMails = await prisma.mail.count({
        where: {
          type: 'SENT'
        },
      });
      console.log(sentMails)
      res.status(200).json({ 
        success: true, 
        data: sentMails ,
        total: totalSentMails,
        page: pageNumber,
        limit: limitNumber,
        message:"data fetched successfully"
      });
    } catch (error) {
      console.error('Error fetching sent mails:', error);
      res.status(500).json({ error: 'Failed to fetch sent mails' });
    }
  }
}
