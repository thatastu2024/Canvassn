
export async function GET(req,res){
    try{
        const newMailBody = await prisma.mailBody.create({
            data: reqData
          });
    }catch(err){

    }
}