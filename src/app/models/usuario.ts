export interface Usuario{
    usuario_id: number | null,
    username: string,
    password: string,

    salario: number,
    edad: number,

    discapacidad: boolean,
    desplazado: boolean,
    migrante: boolean
}