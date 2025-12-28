import { NextResponse, NextRequest } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";


export async function POST(request: NextRequest) {

  const s3client = new S3Client({
    region : 'us-east-1',
    credentials : {
      accessKeyId : process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY!
    }
  })

  
  try{ 
    const  {filename, filetype} = await request.json();
    const command = new PutObjectCommand({
      Bucket : process.env.AWS_BUCKET_UPLOADS!,
      Key : `${uuidv4()}-${filename}`,
      ContentType : filetype || "application/octet-stream",
      // ACL: "public~-read",
    })

    const url = await getSignedUrl(s3client, command, {expiresIn : 600})
    return NextResponse.json({url})
  }

  catch(err) {
    return NextResponse.json({error: 'Bad request'}, {status: 400});
  }

}
function uuidv4(): string {
  return randomUUID();
}
