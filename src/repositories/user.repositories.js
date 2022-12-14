import connection from "../database/db.js";

async function listUserData(token) {
  const selectedUser = await connection.query(
    'SELECT users.id, users.name, SUM(urls."visitCount") AS "visitCount" FROM users JOIN sessions ON users.id = sessions."userId" JOIN urls ON users.id = urls."userId" WHERE sessions.token =$1 GROUP BY users.id',
    [token]
  );

  const allUrls = await connection.query(
    'SELECT urls.id, urls."shortUrl", urls.url, urls."visitCount" FROM urls JOIN sessions ON urls."userId" = sessions."userId" WHERE sessions.token =$1 GROUP BY urls.id',
    [token]
  );

  const userInfoAndUrls = {
    id: selectedUser.rows[0].id,
    name: selectedUser.rows[0].name,
    visitCount: selectedUser.rows[0].visitCount,
    shortenedUrls: allUrls.rows,
  };

  return userInfoAndUrls;
}

export default listUserData;
