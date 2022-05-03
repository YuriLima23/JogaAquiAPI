-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "cpf" TEXT,
    "photo" TEXT,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "token_auth" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Support" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "message_response" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Support_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "previous_balance" DOUBLE PRECISION,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Type_Recicle" (
    "id" SERIAL NOT NULL,
    "price" TEXT NOT NULL,
    "color" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Type_Recicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solicitation" (
    "id" SERIAL NOT NULL,
    "total" DOUBLE PRECISION,
    "status" TEXT NOT NULL,
    "weight" INTEGER,
    "reason_refusal" TEXT,
    "date_of_collect" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Solicitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "History_Transaction" (
    "id" SERIAL NOT NULL,
    "status" INTEGER NOT NULL,
    "solicitation_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "History_Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SolicitationToType_Recicle" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_user_id_key" ON "Wallet"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "History_Transaction_solicitation_id_key" ON "History_Transaction"("solicitation_id");

-- CreateIndex
CREATE UNIQUE INDEX "_SolicitationToType_Recicle_AB_unique" ON "_SolicitationToType_Recicle"("A", "B");

-- CreateIndex
CREATE INDEX "_SolicitationToType_Recicle_B_index" ON "_SolicitationToType_Recicle"("B");

-- AddForeignKey
ALTER TABLE "Support" ADD CONSTRAINT "Support_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitation" ADD CONSTRAINT "Solicitation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History_Transaction" ADD CONSTRAINT "History_Transaction_solicitation_id_fkey" FOREIGN KEY ("solicitation_id") REFERENCES "Solicitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SolicitationToType_Recicle" ADD FOREIGN KEY ("A") REFERENCES "Solicitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SolicitationToType_Recicle" ADD FOREIGN KEY ("B") REFERENCES "Type_Recicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
