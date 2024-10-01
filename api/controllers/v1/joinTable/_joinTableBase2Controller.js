import { StatusCodes } from "http-status-codes";
import ApiError from "../../../utils/apiError.js";

const joinTableBase2Controller = (
  joinTable2Service,
  firstTableName, // Tên bảng đầu tiên (ví dụ: reservations)
  secondTableName // Tên bảng thứ hai (ví dụ: tables)
  // firstColumn, // Cột khóa chính của bảng đầu tiên (ví dụ: reservations_id)
  // secondColumn // Cột khóa chính của bảng thứ hai (ví dụ: tables_id)
) => ({
  addEntries: async (req, res, next) => {
    try {
      const firstId = req.params.id; // ID của bảng đầu tiên (ví dụ: reservationsId)
      const { data } = req.body; // Danh sách ID của bảng thứ hai (ví dụ: tablesIds)

      const addedEntries = await joinTable2Service.addEntries(firstId, data);

      if (!addedEntries) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST, // 400 Bad Request
          `Failed to add ${secondTableName} to ${firstTableName} ID ${firstId}`
        );
      }

      res.status(StatusCodes.CREATED).json(addedEntries); // 201 Created
    } catch (err) {
      next(err);
    }
  },

  getEntries: async (req, res, next) => {
    try {
      const firstId = req.params.id;

      const entries = await joinTable2Service.getEntries(firstId);

      if (!entries || entries.length === 0) {
        throw new ApiError(
          StatusCodes.NOT_FOUND, // 404 Not Found
          `No ${secondTableName} found for ${firstTableName} ID ${firstId}`
        );
      }

      res.status(StatusCodes.OK).json(entries); // 200 OK
    } catch (err) {
      next(err);
    }
  },

  updateEntries: async (req, res, next) => {
    try {
      const firstId = req.params.id;
      const { data } = req.body; // Danh sách ID của bảng thứ hai (ví dụ: tablesIds)

      const updatedEntries = await joinTable2Service.updateEntries(
        firstId,
        data
      );

      if (!updatedEntries) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST, // 400 Bad Request
          `Failed to update ${secondTableName} for ${firstTableName} ID ${firstId}`
        );
      }

      res.status(StatusCodes.OK).json(updatedEntries); // 200 OK
    } catch (err) {
      next(err);
    }
  },

  deleteEntries: async (req, res, next) => {
    try {
      const firstId = req.params.id;
      const secondIds = req.body[`${secondTableName}Ids`]; // Optional: Chỉ định ID của bảng thứ hai nếu muốn xóa cụ thể
      let deletedEntries;
      if (!secondIds) {
        // Xóa tất cả liên kết
        deletedEntries = await joinTable2Service.deleteEntries(firstId);
      } else {
        // Xóa liên kết cụ thể
        deletedEntries = await joinTable2Service.deleteEntries(
          firstId,
          secondIds
        );
      }

      if (!deletedEntries || deletedEntries.length === 0) {
        throw new ApiError(
          StatusCodes.NOT_FOUND, // 404 Not Found
          `No ${secondTableName} found to delete for ${firstTableName} ID ${firstId}`
        );
      }

      res.status(StatusCodes.OK).json(deletedEntries);
    } catch (err) {
      next(err);
    }
  },
});

export default joinTableBase2Controller;
