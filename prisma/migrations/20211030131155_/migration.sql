-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "photo" TEXT,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "type_user" INTEGER NOT NULL,
    "token_auth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Support" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "user" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Support_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "balance" TEXT NOT NULL,
    "previous_balance" TEXT,
    "user" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Type_Recicle" (
    "id" SERIAL NOT NULL,
    "price" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Type_Recicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solicitation" (
    "id" SERIAL NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "status" INTEGER NOT NULL,
    "weight" INTEGER,
    "reason_refusal" TEXT,
    "date_of_collect" TIMESTAMP(3) NOT NULL,
    "user" INTEGER NOT NULL,
    "type_recicle" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Solicitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "History_Transaction" (
    "id" SERIAL NOT NULL,
    "status" INTEGER NOT NULL,
    "solicitation" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "History_Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_user_key" ON "Wallet"("user");

-- CreateIndex
CREATE UNIQUE INDEX "History_Transaction_solicitation_key" ON "History_Transaction"("solicitation");

-- AddForeignKey
ALTER TABLE "Support" ADD CONSTRAINT "Support_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitation" ADD CONSTRAINT "Solicitation_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitation" ADD CONSTRAINT "Solicitation_type_recicle_fkey" FOREIGN KEY ("type_recicle") REFERENCES "Type_Recicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History_Transaction" ADD CONSTRAINT "History_Transaction_solicitation_fkey" FOREIGN KEY ("solicitation") REFERENCES "Solicitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
