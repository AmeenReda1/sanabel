import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('partner')
export class Partner {

    @Column()
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ nullable: false })
    name: string
    
    @Column({ nullable: false })
    image: string;

    @Column({ nullable: false })
    link: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })

    created_at?: Date;
    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updated_at?: Date;
}
