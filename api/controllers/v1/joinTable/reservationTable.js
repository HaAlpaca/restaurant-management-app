import { StatusCodes } from "http-status-codes";
import joinTableService from "../../../services/joinTableService.js";

export const addTableToReservation = async (req, res, next) => {
  try {
    const reservationsId = req.params.id;
    const tablesIds = req.body.tablesIds;
    const reservationTableService = joinTableService(
      "tables_reservations",
      "reservations",
      "tables",
      "reservations_id",
      "tables_id"
    );
    const addTable = await reservationTableService.addEntries(
      reservationsId,
      tablesIds
    );

    if (!addTable) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST, // 400 Bad Request
        `Failed to create ${tableName}`
      );
    }
    res.status(StatusCodes.CREATED).json(addTable); // 201 Created
  } catch (err) {
    next(err);
  }
};

export const getTablefromReservation = async (req, res, next) => {
  try {
    const reservationsId = req.params.id;

    const reservationTableService = joinTableService(
      "tables_reservations",
      "reservations",
      "tables",
      "reservations_id",
      "tables_id"
    );

    const getTable = await reservationTableService.getTablesByReservationId(
      reservationsId
    );

    if (!getTable || getTable.length === 0) {
      throw new ApiError(
        StatusCodes.NOT_FOUND, // 404 Not Found
        `No tables found for reservation ID ${reservationsId}`
      );
    }

    res.status(StatusCodes.OK).json(getTable); // 200 OK
  } catch (err) {
    next(err);
  }
};
