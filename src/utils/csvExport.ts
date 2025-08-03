import * as cloudinary from "cloudinary";
import { Workbook } from "exceljs";
import { existsSync, mkdirSync, rmSync, unlinkSync } from "fs";
import { ErrorWithProps } from "mercurius";
import path from "path";
import Context from "../types/context.type";
import { EnvVars } from "./environment";

export const saveCsvAndUploadToCloudinary = async (
  fileName: string,
  workbook: Workbook,
  ctx: Context
) => {
  try {
    // Cloudinary Config
    cloudinary.v2.config({
      cloud_name: EnvVars.values.CLOUDINARY_CLOUD_NAME,
      api_key: EnvVars.values.CLOUDINARY_API_KEY,
      api_secret: EnvVars.values.CLOUDINARY_API_SECRET,
    });

    const tempDirLoc = path.join(__dirname, "../temp");
    if (!existsSync(tempDirLoc)) {
      mkdirSync(tempDirLoc, { recursive: true });
    }

    const dataFileName = `${fileName}_${ctx.user}_${Date.now()}.csv`;
    const dataSavePath = `${tempDirLoc}/${dataFileName}`;

    await workbook.csv.writeFile(dataSavePath);

    const cloudinaryApiReq = await cloudinary.v2.uploader.upload(dataSavePath, {
      public_id: dataFileName,
      upload_preset: "csv-exports",
      resource_type: "raw",
    });

    // Remove files and folders
    unlinkSync(dataSavePath);
    rmSync(tempDirLoc, { recursive: true, force: true });

    return cloudinaryApiReq.secure_url;
  } catch (error) {
    throw new ErrorWithProps("Unable to generate csv data, please try again");
  }
};
