import { BaseEntity } from '../entities/entity'

export class BaseService<T extends BaseEntity> {
    protected entities: Array<T> = [];
    
    public add(entity: T) {
        if(this.entities.length > 0)
            entity.id = this.entities[this.entities.length - 1].id + 1;
        else
            entity.id = 1;
        this.entities.push(entity);
        return entity;
    }

    public remove(id: number) : boolean {
        let bidIndex = this.entities.findIndex(x => x.id == id);
        if(bidIndex != -1) {
            this.entities.splice(bidIndex, 1);
            return true;
        }
        return false;
    }

    public get(id: number) : T | undefined {
        return this.entities.find(x => x.id == id);
    }

    public update(entity: T) : boolean{
        let currentBidIndex = this.entities.findIndex(x => x.id == entity.id);
        if(currentBidIndex != -1) {
            this.entities[currentBidIndex] = entity;
            return true;
        }
        return false;
    }

    public getAll() : Array<T> {
        return this.entities;
    }
}