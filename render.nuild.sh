#!/usr/bin/env bash

npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run build
