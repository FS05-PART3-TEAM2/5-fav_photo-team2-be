import app from "./app";
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`서버 동작 완료 ${PORT}`);
});
