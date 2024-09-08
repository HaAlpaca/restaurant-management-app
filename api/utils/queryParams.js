const insertQuery = (tableName, props, values) => {
  const columns = props.join(", ");
  const placeholders = props.map((_, index) => `$${index + 1}`).join(", ");

  const query = {
    text: `INSERT INTO ${tableName} (${columns}) VALUES(${placeholders}) RETURNING *`,
    values: values,
  };
  return query;
};

const updateQuery = (
  tableName,
  props,
  values,
  conditionColumn,
  conditionValue
) => {
  const setClause = props
    .map((prop, index) => `${prop} = $${index + 1}`)
    .join(", ");
  const conditionPlaceholder = `$${props.length + 1}`;

  const query = {
    text: `
        UPDATE ${tableName}
        SET ${setClause}
        WHERE ${conditionColumn} = ${conditionPlaceholder}
        RETURNING *`,
    values: [...values, conditionValue],
  };

  return query;
};
const selectIdQuery = (idName, id, tableName) => {
  const query = {
    text: `SELECT * FROM ${tableName} WHERE ${idName} = $1`,
    values: [id],
  };
  return query;
};
const deleteIdQuery = (idName, id, tableName) => {
  const query = {
    text: `DELETE FROM  ${tableName} WHERE ${idName} = $1`,
    values: [id],
  };
  return query;
};
const selectAllQuery = (tableName) => {
  const query = {
    text: `SELECT * FROM ${tableName} `,
    values: [],
  };
  return query;
};
export {
  selectAllQuery,
  deleteIdQuery,
  selectIdQuery,
  insertQuery,
  updateQuery,
};
