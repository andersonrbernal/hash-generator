import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class File {
    id: string;
    mime_type: string;
    hash: string;
    buffer: Buffer;
    createdAt: Date;
    updatedAt: Date;
}

@Entity()
export class FileTypeOrm implements File {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    mime_type: string;

    @Column()
    hash: string;

    @Column('bytea')
    buffer: Buffer;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}