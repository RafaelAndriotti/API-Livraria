-- CreateTable
CREATE TABLE "autores" (
    "id" UUID NOT NULL,
    "autor_nome" TEXT NOT NULL,
    "nacionalidade_autor" TEXT NOT NULL,
    "data_nascimento" TEXT NOT NULL,
    "biografia" TEXT NOT NULL,

    CONSTRAINT "autores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "editoras" (
    "id" UUID NOT NULL,
    "nome_editora" TEXT NOT NULL,
    "pais_editora" TEXT NOT NULL,
    "site_editora" TEXT NOT NULL,
    "email_contato" TEXT NOT NULL,

    CONSTRAINT "editoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livros" (
    "id" UUID NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor_id" UUID NOT NULL,
    "editora_id" UUID NOT NULL,
    "isbn" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "paginas" INTEGER NOT NULL,
    "ano_publicacao" INTEGER NOT NULL,
    "genero" TEXT NOT NULL,
    "estoque" INTEGER NOT NULL,
    "sinopse" TEXT NOT NULL,

    CONSTRAINT "livros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "livros_isbn_key" ON "livros"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "livros" ADD CONSTRAINT "livros_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "autores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livros" ADD CONSTRAINT "livros_editora_id_fkey" FOREIGN KEY ("editora_id") REFERENCES "editoras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
