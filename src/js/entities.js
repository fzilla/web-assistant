class Entities {
    constructor(entities) {
        this.entities = entities;

        this.object           = this.getEntityValue('object:object');
        this.object_attribute = this.getEntityValue('object_attribute:object_attribute');
        this.operation        = this.getEntityValue('operation:operation');
        this.tab_operation    = this.getEntityValue('tab_operation:tab_operation');
        this.nav_direction    = this.getEntityValue('nav_direction:nav_direction');
        this.direction        = this.getEntityValue('direction:direction');
        this.google_menu      = this.getEntityValue('google_menu:google_menu');
        this.search_provider  = this.getEntityValue('search_provider:search_provider');
        this.youtube_menu     = this.getEntityValue('youtube_menu:youtube_menu');

        this.search_query     = this.getEntityValue('wit$search_query:search_query');

        this.number       = this.getEntityValue('wit$number:number');
        if (!this.number) {
            this.number   = this.getEntityValue('wit$ordinal:ordinal');
        }

        this.url          = this.getEntityValue('wit$url:url');
        if (this.url && !(this.url.startsWith('http') || this.url.startsWith('www.'))) {
            this.url = 'http://' + this.url;
        }
    }

    getEntityValue(name, defaultValue = null) {
        return this.entities[name] && this.entities[name][0] ? this.entities[name][0]['value'] : defaultValue;
    }
}

export default Entities;
