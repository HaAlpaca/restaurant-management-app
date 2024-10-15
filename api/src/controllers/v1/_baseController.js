import baseService from "../../services/v1/baseService.js";
import ApiError from "../../utils/apiError.js";
import { StatusCodes } from "http-status-codes"; // Sử dụng mã trạng thái HTTP chuẩn

const baseController = (tableName, idColumn, fields, imageField = null) => {
  const service = baseService(tableName, idColumn, fields, imageField);
  return {
    create: async (req, res, next) => {
      try {
        const createdRow = await service.create(req.body, req.file?.path);
        if (!createdRow) {
          throw new ApiError(
            StatusCodes.BAD_REQUEST, // 400 Bad Request
            `Failed to create ${tableName}`
          );
        }
        res.status(StatusCodes.CREATED).json(createdRow); // 201 Created
      } catch (err) {
        next(err);
      }
    },

    getById: async (req, res, next) => {
      try {
        const resultRow = await service.getById(req.params.id);
        if (!resultRow) {
          throw new ApiError(
            StatusCodes.NOT_FOUND, // 404 Not Found
            `${tableName} not found`
          );
        }
        res.status(StatusCodes.OK).json(resultRow); // 200 OK
      } catch (err) {
        next(err);
      }
    },

    getAll: async (req, res, next) => {
      try {
        const filters = req.query; // Lấy các filter từ query
        let sortField = null;
        let sortOrder = "ASC"; // Mặc định là 'ASC' nếu không có

        // Kiểm tra và xử lý query parameter 'sort'
        if (req.query.sort) {
          const sortParams = req.query.sort.split(" "); // Tách 'sort' thành field và order
          sortField = sortParams[0]; // Ví dụ: 'price'
          sortOrder = sortParams[1]?.toUpperCase() || "ASC"; // Ví dụ: 'DESC', mặc định 'ASC'
        }

        // Kết hợp sortField và sortOrder nếu có
        const sort = sortField ? `${sortField} ${sortOrder}` : null;

        // Gọi service với filters và sort
        const resultRows = await service.getAll(filters, sort);

        if (resultRows.length === 0) {
          throw new ApiError(
            StatusCodes.NOT_FOUND, // 404 Not Found
            `${tableName} not found`
          );
        }

        res.status(StatusCodes.OK).json(resultRows); // 200 OK
      } catch (err) {
        next(err);
      }
    },

    updateById: async (req, res, next) => {
      try {
        const updatedRow = await service.updateById(
          req.params.id,
          req.body,
          req.file?.path
        );
        if (!updatedRow) {
          throw new ApiError(
            StatusCodes.NOT_FOUND, // 404 Not Found
            `${tableName} not found`
          );
        }
        res.status(StatusCodes.OK).json(updatedRow); // 200 OK
      } catch (err) {
        next(err);
      }
    },

    deleteById: async (req, res, next) => {
      try {
        const deletedRow = await service.deleteById(req.params.id);
        if (!deletedRow) {
          throw new ApiError(
            StatusCodes.NOT_FOUND, // 404 Not Found
            `${tableName} not found`
          );
        }
        res
          .status(StatusCodes.OK)
          .json({ message: `${tableName} deleted successfully` }); // 200 OK
      } catch (err) {
        next(err);
      }
    },
  };
};

export default baseController;
